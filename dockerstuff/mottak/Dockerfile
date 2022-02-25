FROM openjdk:17-jdk-alpine
ARG github_username
ARG github_token
ARG git_commit

RUN apk add git maven

RUN git clone https://github.com/navikt/familie-ba-mottak.git /app \
    && cd /app \
    && git checkout $git_commit

WORKDIR /app

# Unmock dokgen, sett opp tokenx issuer og client-configuration, fjern devconfig
COPY ./gitdiff gitdiff
RUN git apply gitdiff

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install -Dmaven.test.skip=true --settings .m2/maven-settings.xml

COPY ./mottak-magic-invocation.sh /mottak-launch.sh
CMD ["/mottak-launch.sh"]