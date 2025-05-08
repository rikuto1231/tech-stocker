plugins {
    kotlin("jvm") version "1.9.0"
    application
}

group = "com.techstocker"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}

application {
    mainClass.set("notification.MainKt")
}

tasks.jar {
    manifest {
        attributes["Main-Class"] = "notification.MainKt"
    }
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
} 