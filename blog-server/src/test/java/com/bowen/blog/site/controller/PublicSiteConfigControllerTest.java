package com.bowen.blog.site.controller;

import com.bowen.blog.common.GlobalExceptionHandler;
import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.service.SiteConfigService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PublicSiteConfigControllerTest {

    @Test
    void getEndpointReturnsPublicSiteConfig() throws Exception {
        SiteConfigService siteConfigService = mock(SiteConfigService.class);
        when(siteConfigService.getSiteConfig()).thenReturn(buildConfig());

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new PublicSiteConfigController(siteConfigService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        mockMvc.perform(get("/api/site-config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.siteName").value("Bowen Blog"))
                .andExpect(jsonPath("$.data.heroTitle").value("Java Backend Developer"));
    }

    private SiteConfig buildConfig() {
        SiteConfig config = new SiteConfig();
        config.setSiteName("Bowen Blog");
        config.setHeroTitle("Java Backend Developer");
        config.setHeroSubtitle("Programming notes and technical practice");
        config.setAboutMe("A pragmatic Java backend developer.");
        config.setSkillsBackend("Java, Spring Boot");
        config.setSkillsFrontend("React");
        config.setSkillsDatabase("MySQL");
        config.setSkillsTools("Docker, Nginx");
        config.setEmail("bowen@example.com");
        config.setGithubUrl("https://github.com/bowen");
        config.setResumeUrl("https://example.com/resume.pdf");
        return config;
    }
}
