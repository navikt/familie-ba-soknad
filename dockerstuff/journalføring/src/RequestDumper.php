<?php

namespace App;

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

        $identifier = md5(json_encode($requestData)).substr(0, 5);
        $directory = (getenv("STORAGE_DIRECTORY") ?: "/tmp") . "/$identifier";

        mkdir($directory);

        $filePath = "$directory/request.json";

        $this->logger->info("Logging request to file $filePath");

        file_put_contents($filePath, json_encode($requestData));

        foreach ($requestData["hoveddokumentvarianter"] as $document) {
            $extension = match ($document["filtype"]) {
                "PDFA" => "pdf",
                default => "json"
            };
            $contents = base64_decode($document["dokument"]);

            $filePath = "$directory/hoveddok.$extension";
            $this->logger->info("Writing main document $extension to $filePath");
            file_put_contents($filePath, $contents);
        }
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
}
