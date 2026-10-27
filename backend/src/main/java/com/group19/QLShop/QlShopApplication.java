package com.group19.QLShop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QlShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(QlShopApplication.class, args);
	}

}
