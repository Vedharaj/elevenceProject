package com.example.jira;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JiraApplication {

	private static final Logger logger = LoggerFactory.getLogger(JiraApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(JiraApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		logger.info("==========================================================");
		logger.info("  Jira Clone Application is UP and running!");
		logger.info("  Port: " + (System.getProperty("server.port") != null ? System.getProperty("server.port") : "8080"));
		logger.info("  Ready to process requests and keep-alive health pings.");
		logger.info("==========================================================");
	}

}
