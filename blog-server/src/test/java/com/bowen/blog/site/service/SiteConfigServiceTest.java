package com.bowen.blog.site.service;

import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.mapper.SiteConfigMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("站点配置服务单元测试")
class SiteConfigServiceTest {

    @Mock
    private SiteConfigMapper siteConfigMapper;

    @InjectMocks
    private SiteConfigService siteConfigService;

    @Test
    @DisplayName("查询站点配置 - 存在配置时返回配置")
    void testGetSiteConfig_WhenExists_ReturnsConfig() {
        SiteConfig existing = buildConfig();
        existing.setId(1L);
        when(siteConfigMapper.findFirst()).thenReturn(existing);

        SiteConfig result = siteConfigService.getSiteConfig();

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getSiteName()).isEqualTo("Bowen Blog");
    }

    @Test
    @DisplayName("查询站点配置 - 不存在配置时返回空配置对象")
    void testGetSiteConfig_WhenMissing_ReturnsEmptyConfig() {
        when(siteConfigMapper.findFirst()).thenReturn(null);

        SiteConfig result = siteConfigService.getSiteConfig();

        assertThat(result.getId()).isNull();
        assertThat(result.getSiteName()).isEmpty();
        assertThat(result.getHeroTitle()).isEmpty();
        assertThat(result.getResumeUrl()).isEmpty();
    }

    @Test
    @DisplayName("保存站点配置 - 无现有记录时插入")
    void testSaveSiteConfig_WhenMissing_Inserts() {
        SiteConfig request = buildConfig();
        when(siteConfigMapper.findFirst()).thenReturn(null);
        doAnswer(invocation -> {
            SiteConfig config = invocation.getArgument(0);
            config.setId(1L);
            return 1;
        }).when(siteConfigMapper).insert(any(SiteConfig.class));

        SiteConfig result = siteConfigService.saveSiteConfig(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getSiteName()).isEqualTo("Bowen Blog");
        verify(siteConfigMapper, never()).updateById(any(SiteConfig.class));
    }

    @Test
    @DisplayName("保存站点配置 - 有现有记录时更新")
    void testSaveSiteConfig_WhenExists_Updates() {
        SiteConfig existing = buildConfig();
        existing.setId(1L);

        SiteConfig request = buildConfig();
        request.setSiteName("Updated Blog");
        request.setHeroTitle("Updated Hero");

        when(siteConfigMapper.findFirst()).thenReturn(existing);
        when(siteConfigMapper.updateById(any(SiteConfig.class))).thenReturn(1);

        SiteConfig result = siteConfigService.saveSiteConfig(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getSiteName()).isEqualTo("Updated Blog");
        assertThat(result.getHeroTitle()).isEqualTo("Updated Hero");
        verify(siteConfigMapper, never()).insert(any(SiteConfig.class));
    }

    @Test
    @DisplayName("保存站点配置 - 请求为空时抛出异常")
    void testSaveSiteConfig_WhenRequestIsNull_ThrowsException() {
        assertThatThrownBy(() -> siteConfigService.saveSiteConfig(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Site config must not be null");

        verify(siteConfigMapper, never()).insert(any(SiteConfig.class));
        verify(siteConfigMapper, never()).updateById(any(SiteConfig.class));
    }

    @Test
    @DisplayName("保存站点配置 - 关键字段为空时抛出异常")
    void testSaveSiteConfig_WhenFieldIsBlank_ThrowsException() {
        SiteConfig request = buildConfig();
        request.setSiteName(" ");

        assertThatThrownBy(() -> siteConfigService.saveSiteConfig(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("siteName must not be blank");

        verify(siteConfigMapper, never()).insert(any(SiteConfig.class));
        verify(siteConfigMapper, never()).updateById(any(SiteConfig.class));
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
