package com.mercato;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Full context requires external PostgreSQL; covered by focused unit tests")
class EcommerceDbConfigBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
