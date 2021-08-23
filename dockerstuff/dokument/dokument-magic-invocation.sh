#!/usr/bin/env sh

mvn spring-boot:run \
    -Dspring-boot.run.useTestClasspath=true \
    -Dspring-boot.run.directories=target/test-classes \
    '-Dmain-class=no.nav.familie.dokument.DevLauncherKt'