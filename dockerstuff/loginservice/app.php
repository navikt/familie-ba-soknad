<?php

$psr17Factory = new \Nyholm\Psr7\Factory\Psr17Factory();

$serverRequestCreator = new \Nyholm\Psr7Server\ServerRequestCreator(
    $psr17Factory,
    $psr17Factory,
    $psr17Factory,
    $psr17Factory
);

$requestHandlerRunner = new \Laminas\HttpHandlerRunner\RequestHandlerRunner(
    handler: new \App\LoginMock($psr17Factory, $psr17Factory, new \Buzz\Client\Curl($psr17Factory)),
    emitter: new \Laminas\HttpHandlerRunner\Emitter\SapiEmitter(),
    serverRequestFactory: [$serverRequestCreator, 'fromGlobals'],
    serverRequestErrorResponseGenerator: fn () => null
);

$requestHandlerRunner->run();