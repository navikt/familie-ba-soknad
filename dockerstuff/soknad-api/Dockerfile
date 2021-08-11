FROM openjdk:15-jdk-alpine as builder
ARG github_username
ARG github_token

RUN test -n "$github_username" \
    && test -n "$github_token" \
    && apk add git maven

RUN git clone https://github.com/navikt/familie-ba-soknad-api.git /app
WORKDIR /app

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install --settings .m2/maven-settings.xml

COPY ./soknad-magic-invocation.sh /soknad-launch.sh
CMD ["/soknad-launch.sh"]