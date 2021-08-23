#!/usr/bin/env sh

mvn spring-boot:run \
    -Dspring-boot.run.useTestClasspath=true \
    -Dspring-boot.run.folders=target/test-classes \
    '-Dstart-class=no.nav.familie.ba.soknad.api.LokalLauncherKt'