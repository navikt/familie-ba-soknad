FROM openjdk:15-jdk-alpine as builder
ARG github_username
ARG github_token

RUN test -n "$github_username" \
    && test -n "$github_token" \
    && apk add git maven

RUN git clone https://github.com/navikt/familie-ba-mottak.git /app
WORKDIR /app

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install -Dmaven.test.skip=true --settings .m2/maven-settings.xml

COPY ./mottak-magic-invocation.sh /mottak-launch.sh
CMD ["/mottak-launch.sh"]