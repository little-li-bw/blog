package com.bowen.blog.site.service;

import com.bowen.blog.site.entity.SiteConfig;
import com.bowen.blog.site.mapper.SiteConfigMapper;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class SiteConfigService {

    private final SiteConfigMapper siteConfigMapper;

    public SiteConfigService(SiteConfigMapper siteConfigMapper) {
        this.siteConfigMapper = siteConfigMapper;
    }

    public SiteConfig getSiteConfig() {
        SiteConfig existing = siteConfigMapper.findFirst();
        return existing == null ? emptyConfig() : existing;
    }

    public SiteConfig saveSiteConfig(SiteConfig request) {
        if (request == null) {
            throw new IllegalArgumentException("Site config must not be null");
        }

        validateRequiredFields(request);

        SiteConfig existing = siteConfigMapper.findFirst();
        if (existing == null) {
            SiteConfig newConfig = copyFields(new SiteConfig(), request);
            siteConfigMapper.insert(newConfig);
            return newConfig;
        }

        copyFields(existing, request);
        siteConfigMapper.updateById(existing);
        return existing;
    }

    private void validateRequiredFields(SiteConfig request) {
        Map<String, String> requiredFields = new LinkedHashMap<>();
        requiredFields.put("siteName", request.getSiteName());
        requiredFields.put("heroTitle", request.getHeroTitle());
        requiredFields.put("heroSubtitle", request.getHeroSubtitle());
        requiredFields.put("aboutMe", request.getAboutMe());
        requiredFields.put("skillsBackend", request.getSkillsBackend());
        requiredFields.put("skillsFrontend", request.getSkillsFrontend());
        requiredFields.put("skillsDatabase", request.getSkillsDatabase());
        requiredFields.put("skillsTools", request.getSkillsTools());
        requiredFields.put("email", request.getEmail());
        requiredFields.put("githubUrl", request.getGithubUrl());
        requiredFields.put("resumeUrl", request.getResumeUrl());

        for (Map.Entry<String, String> entry : requiredFields.entrySet()) {
            if (entry.getValue() == null || entry.getValue().trim().isEmpty()) {
                throw new IllegalArgumentException(entry.getKey() + " must not be blank");
            }
        }
    }

    private SiteConfig copyFields(SiteConfig target, SiteConfig source) {
        target.setSiteName(source.getSiteName().trim());
        target.setHeroTitle(source.getHeroTitle().trim());
        target.setHeroSubtitle(source.getHeroSubtitle().trim());
        target.setAboutMe(source.getAboutMe().trim());
        target.setSkillsBackend(source.getSkillsBackend().trim());
        target.setSkillsFrontend(source.getSkillsFrontend().trim());
        target.setSkillsDatabase(source.getSkillsDatabase().trim());
        target.setSkillsTools(source.getSkillsTools().trim());
        target.setEmail(source.getEmail().trim());
        target.setGithubUrl(source.getGithubUrl().trim());
        target.setResumeUrl(source.getResumeUrl().trim());
        return target;
    }

    private SiteConfig emptyConfig() {
        SiteConfig empty = new SiteConfig();
        empty.setSiteName("");
        empty.setHeroTitle("");
        empty.setHeroSubtitle("");
        empty.setAboutMe("");
        empty.setSkillsBackend("");
        empty.setSkillsFrontend("");
        empty.setSkillsDatabase("");
        empty.setSkillsTools("");
        empty.setEmail("");
        empty.setGithubUrl("");
        empty.setResumeUrl("");
        return empty;
    }
}
