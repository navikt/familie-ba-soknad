#!/usr/bin/env sh

mvn spring-boot:run \
    -Dspring-boot.run.useTestClasspath=true \
    -Dspring-boot.run.folders=target/test-classes \
    '-Dmain-class=no.nav.familie.ba.mottak.DevLauncherPostgresKt' \
    -Dspring-boot.run.jvmArguments="-Dspring.cloud.vault.enabled=false -Dspring.cloud.vault.database.role=postgres '-Dspring.datasource.url=jdbc:postgresql://postgres:5432/familie-ba-mottak'"