package com.bowen.blog.site.entity;

import java.time.LocalDateTime;

public class SiteConfig {

    private Long id;
    private String siteName;
    private String heroTitle;
    private String heroSubtitle;
    private String aboutMe;
    private String skillsBackend;
    private String skillsFrontend;
    private String skillsDatabase;
    private String skillsTools;
    private String email;
    private String githubUrl;
    private String resumeUrl;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getHeroTitle() {
        return heroTitle;
    }

    public void setHeroTitle(String heroTitle) {
        this.heroTitle = heroTitle;
    }

    public String getHeroSubtitle() {
        return heroSubtitle;
    }

    public void setHeroSubtitle(String heroSubtitle) {
        this.heroSubtitle = heroSubtitle;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getSkillsBackend() {
        return skillsBackend;
    }

    public void setSkillsBackend(String skillsBackend) {
        this.skillsBackend = skillsBackend;
    }

    public String getSkillsFrontend() {
        return skillsFrontend;
    }

    public void setSkillsFrontend(String skillsFrontend) {
        this.skillsFrontend = skillsFrontend;
    }

    public String getSkillsDatabase() {
        return skillsDatabase;
    }

    public void setSkillsDatabase(String skillsDatabase) {
        this.skillsDatabase = skillsDatabase;
    }

    public String getSkillsTools() {
        return skillsTools;
    }

    public void setSkillsTools(String skillsTools) {
        this.skillsTools = skillsTools;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }
}
