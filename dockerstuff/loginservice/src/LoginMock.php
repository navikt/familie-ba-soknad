<?php

namespace App;

use DateTimeImmutable;
use Dflydev\FigCookies\SetCookie;
use Dflydev\FigCookies\SetCookies;
use Psr\Http\Client\ClientExceptionInterface;
use Psr\Http\Client\ClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoginMock implements RequestHandlerInterface
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
        private RequestFactoryInterface $requestFactory,
        private ClientInterface $httpClient
    ) {}

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        ['redirect' => $redirect, 'subject' => $personId] = $request->getQueryParams();

        $response = $this->responseFactory->createResponse(301)->withHeader("Location", $redirect);

        try {
            $token = $this->getUserToken($personId);
        } catch (ClientExceptionInterface $e) {
            return $response;
        }

        $tokenCookieName = getenv("TOKEN_COOKIE_NAME");
        $cookie = SetCookie::create($tokenCookieName, $token)
            ->withDomain("localhost")
            ->withExpires(new DateTimeImmutable("tomorrow"))
            ->withPath("/")
            ->withSecure(false)
            ->withHttpOnly(false);

        $cookies = SetCookies::fromResponse($response)->with($cookie);
        return $cookies->renderIntoSetCookieHeader($response);
    }

    /**
     * @throws ClientExceptionInterface
     */
    private function getUserToken(string $personId): string
    {
        $url = sprintf("%s?%s",
            getenv("FAKEDINGS_ADDRESS") ?? "http://fakedings",
            http_build_query([
                'acr' => 'Level4',
                'pid' => $personId
            ])
        );
        $request = $this->requestFactory->createRequest("GET", $url);
        $response = $this->httpClient->sendRequest($request);

        return $response->getBody()->getContents();
    }
}
