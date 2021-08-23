<?php

namespace App;

use finfo as FileInfo;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Log\LoggerInterface;
use Ramsey\Uuid\Uuid;

class RequestDumper implements RequestHandlerInterface
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private StreamFactoryInterface $streamFactory,
        private LoggerInterface $logger
    ) {}

    /**
     * Receives a journaling request, saves documents to files on disk for viewing
     *
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $this->writeArchiveRequestToDisk($request);
        $responseBody = $this->fakeArchiveResponseResource();

        return $this->responseFactory->createResponse()
            ->withBody($this->streamFactory->createStream($responseBody))
            ->withHeader("Content-Type", "application/json");
    }

    private function writeArchiveRequestToDisk(ServerRequestInterface $request): void
    {
        $requestData = json_decode($request->getBody()->getContents(), associative: true);

        $identifier = substr(md5(json_encode($requestData)), 0, 7);
        $directory = (getenv("STORAGE_DIRECTORY") ?: "/tmp") . "/$identifier";
        mkdir($directory);

        $filePath = "$directory/request.json";

        $this->logger->info("Logging request to file $filePath");

        file_put_contents($filePath, json_encode($requestData));

        foreach ($requestData["hoveddokumentvarianter"] as $document) {
            $this->writeDocument($document, $directory, "hoveddokument");
        }

        foreach ($requestData["vedleggsdokumenter"] as $idx => $document) {
            $this->writeDocument($document, $directory, "vedlegg-$idx");
        }
    }

    private function writeDocument(array $document, string $directory, $filename): void
    {
        $contents = base64_decode($document["dokument"]);
        $extension = $this->findFileExtension($document);

        $filePath = "$directory/$filename.$extension";
        $this->logger->info("Writing document $extension to $filePath");
        file_put_contents($filePath, $contents);
    }

    private function fakeArchiveResponseResource(): string
    {
        return json_encode([
            'data' => [
                'dokumenter' => [],
                'ferdigstilt' => false,
                'journalpostId' => Uuid::uuid4()
            ],
            'status' => 'SUKSESS',
            'melding' => 'OK'
        ]);
    }

    private function findFileExtension(array $document): string
    {
        $documentContent = base64_decode($document["dokument"]);
        /**
         * Ordinarily we'd just do this but in devmode familie-dokument doesn't convert attachments to pdf
         *
         * $extension = match ($document["filtype"]) {
         *      "PDFA" => "pdf",
         *      default => "json"
         * };
         *
         * So instead we have to figure out the file type from the contents and choose an ext based on that.
         * We'll still use it as a fallback if finfo gets confused
         */

        $fallbackExtension = match ($document["filtype"]) {
            "PDFA" => "pdf",
            default => "json"
        };

        $finfo = new FileInfo(flags: FILEINFO_EXTENSION);
        $extensions = $finfo->buffer($documentContent) ?: "txt";
        $extension = explode('/', $extensions)[0];

        // No idea why but sometimes the discovered extension is ???, treat it as not found
        if ($extension === "???" || $extension == false) {
            return $fallbackExtension;
        }

        return $extension;
    }
}
