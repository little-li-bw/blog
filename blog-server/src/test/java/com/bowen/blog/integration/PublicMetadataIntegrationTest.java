package com.bowen.blog.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Sql(scripts = {"/schema-h2.sql", "/data-h2.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class PublicMetadataIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicEndpointsExposeSeededSiteMetadata() throws Exception {
        mockMvc.perform(get("/api/site-config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.siteName").value("Bowen Blog"))
                .andExpect(jsonPath("$.data.githubUrl").value("https://github.com/libowen"));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[*].name", containsInAnyOrder("Java", "Spring Boot")));

        mockMvc.perform(get("/api/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[*].name", containsInAnyOrder("Backend", "Java", "Spring")));
    }
}
