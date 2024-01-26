package com.example.server;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.example.server.ServerApplication;

@SpringBootTest
class ServerApplicationTests {

	@Autowired
	private ServerApplication serverApplication;

	@Test
	void contextLoads() {
		assert(serverApplication != null);
	}

}
