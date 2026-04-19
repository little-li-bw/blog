USE blog;

INSERT INTO admin_user (username, password, nickname)
VALUES (
    'admin',
    '$2b$12$9.hdY8DAGbdktHGNRMpLkOtL0yIMpCqWt0PHucfwmBtVKfTV.Ce9e',
    'Bowen'
)
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    nickname = VALUES(nickname);

INSERT INTO site_config (
    id,
    site_name,
    hero_title,
    hero_subtitle,
    about_me,
    skills_backend,
    skills_frontend,
    skills_database,
    skills_tools,
    email,
    github_url,
    resume_url
)
VALUES (
    1,
    'Bowen Blog',
    'Java Backend Developer / Technical Notes',
    'A personal blog for resume showcase, technical learning notes, and backend engineering practice.',
    'Computer science graduate focused on Java backend development, engineering fundamentals, and continuous writing.',
    'Java, Spring Boot, Spring MVC, MyBatis-Plus',
    'React, TypeScript, Tailwind CSS',
    'MySQL, Redis',
    'Git, Maven, Docker, Nginx, Tencent Cloud',
    'libowen826@email.com',
    'https://github.com/libowen',
    '#'
)
ON DUPLICATE KEY UPDATE
    site_name = VALUES(site_name),
    hero_title = VALUES(hero_title),
    hero_subtitle = VALUES(hero_subtitle),
    about_me = VALUES(about_me),
    skills_backend = VALUES(skills_backend),
    skills_frontend = VALUES(skills_frontend),
    skills_database = VALUES(skills_database),
    skills_tools = VALUES(skills_tools),
    email = VALUES(email),
    github_url = VALUES(github_url),
    resume_url = VALUES(resume_url);

-- Default admin login:
-- username: admin
-- password: admin123456
