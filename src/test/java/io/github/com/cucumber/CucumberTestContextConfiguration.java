package io.github.com.cucumber;

import io.cucumber.spring.CucumberContextConfiguration;
import io.github.com.TestProjectApp;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = TestProjectApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
