FROM openjdk:15-jdk-alpine
ARG github_username
ARG github_token
ARG git_commit

RUN apk add git maven

RUN git clone https://github.com/navikt/familie-dokument.git /app \
    && cd /app \
    && git checkout $git_commit
WORKDIR /app

ENV GITHUB_USERNAME=$github_username
ENV GITHUB_TOKEN=$github_token

RUN mvn clean install --settings .m2/maven-settings.xml

# Unmock jwt validation og fjern tester som ikke compiler som følge
COPY ./gitdiff gitdiff
RUN git apply ./gitdiff

COPY ./dokument-magic-invocation.sh /dokument-launch.sh
CMD ["/dokument-launch.sh"]