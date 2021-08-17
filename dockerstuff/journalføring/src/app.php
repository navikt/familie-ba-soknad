<?php

use App\RequestDumper;
use Laminas\HttpHandlerRunner\Emitter\SapiEmitter;
use Laminas\HttpHandlerRunner\RequestHandlerRunner;
use Monolog\Logger;
use Nyholm\Psr7\Factory\Psr17Factory;
use Nyholm\Psr7Server\ServerRequestCreator;

$logger = new Logger('main');
$logHandler = new \Monolog\Handler\StreamHandler("php://stdout");
$logger->pushHandler($logHandler);

// Factory implementing many interfaces for generating requests, responses, streams etc
$psr17Factory = new Psr17Factory();

$serverRequestCreator = new ServerRequestCreator(
    serverRequestFactory: $psr17Factory,
    uriFactory: $psr17Factory,
    uploadedFileFactory: $psr17Factory,
    streamFactory: $psr17Factory
);

$requestHandler = new RequestDumper(responseFactory: $psr17Factory, streamFactory: $psr17Factory, logger: $logger);

$requestHandlerRunner = new RequestHandlerRunner(
    handler: $requestHandler,
    emitter: new SapiEmitter(),
    serverRequestFactory: fn () => $serverRequestCreator->fromGlobals(),
    serverRequestErrorResponseGenerator: fn (Throwable $t) => $psr17Factory->createResponse(500, $t->getMessage())
);

$requestHandlerRunner->run();
