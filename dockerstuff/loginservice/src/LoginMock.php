<?php

namespace App;

use Dflydev\FigCookies\FigResponseCookies;
use Dflydev\FigCookies\SetCookie;
use Psr\Http\Client\ClientExceptionInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoginMock implements RequestHandlerInterface
{
    public function __construct(private ResponseFactoryInterface $responseFactory, private LoginService $loginService)
    {}

    /**
     * Logs the user in by getting a fake idporten token from a fake oauth server, sets the cookie specified by the
     * environment variable TOKEN_COOKIE_NAME and redirects back to the app.
     * Expects the GET parameters 'redirect' and 'subject' to be present on the request, throws if they are missing.
     *
     * @param ServerRequestInterface $request
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        ['redirect' => $redirect, 'subject' => $personId] = $request->getQueryParams();

        $response = $this->responseFactory->createResponse(301)
            ->withHeader('Cache-Control', 'no-store')
            ->withHeader("Location", $redirect);

        try {
            $token = $this->loginService->getUserToken($personId);
        } catch (ClientExceptionInterface $e) {
            return $response;
        }

        $tokenCookieName = getenv("TOKEN_COOKIE_NAME");
        $cookie = SetCookie::create($tokenCookieName, $token)
            ->withDomain("localhost")
            ->withExpires(0)
            ->withPath("/")
            ->withSecure(false)
            ->withHttpOnly(false);

        return FigResponseCookies::set($response, $cookie);
    }
}
