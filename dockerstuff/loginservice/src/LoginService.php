<?php

namespace App;

use Psr\Http\Client\ClientExceptionInterface;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use Psr\Http\Message\StreamInterface;

class LoginService
{
    public function __construct(
        private RequestFactoryInterface $requestFactory,
        private StreamFactoryInterface $streamFactory,
        private ClientInterface $httpClient
    ) {}

    /**
     * @throws ClientExceptionInterface
     */
    public function getUserToken(string $personId): string
    {
        $url = sprintf("%s/fake/custom", getenv("FAKEDINGS_ADDRESS") ?? "http://fakedings");
        $request = $this->requestFactory->createRequest("POST", $url)
            ->withHeader("Content-Type", "application/x-www-form-urlencoded")
            ->withBody($this->createPostBody([
                'sub' => $personId,
                'acr' => "Level4",
                'aud' => "notfound"
            ]));
        $response = $this->httpClient->sendRequest($request);

        return $response->getBody()->getContents();
    }

    private function createPostBody(array $params): StreamInterface
    {
        return $this->streamFactory->createStream(http_build_query($params));
    }

}