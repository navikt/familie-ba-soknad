<?php

use App\LoginMock;
use App\LoginService;
use Buzz\Client\Curl;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use Laminas\HttpHandlerRunner\RequestHandlerRunner;
use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7Server\ServerRequestCreator;

// Factory implementing many interfaces for generating requests, responses, streams etc
$psr17Factory = new Psr17Factory();

$serverRequestCreator = new ServerRequestCreator(
    serverRequestFactory: $psr17Factory,
    uriFactory: $psr17Factory,
    uploadedFileFactory: $psr17Factory,
    streamFactory: $psr17Factory
);

$loginService = new LoginService(
    requestFactory: $psr17Factory,
    streamFactory: $psr17Factory,
    httpClient: new Curl($psr17Factory)
);

$requestHandler = new LoginMock(
    responseFactory: $psr17Factory,
    loginService: $loginService
);

$requestHandlerRunner = new RequestHandlerRunner(
    handler: $requestHandler,
    emitter: new SapiEmitter(),
    serverRequestFactory: fn () => $serverRequestCreator->fromGlobals(),
    serverRequestErrorResponseGenerator: fn (Throwable $t) => $psr17Factory->createResponse(500, $t->getMessage())
);

$requestHandlerRunner->run();
