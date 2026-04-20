INSERT INTO admin_user (id, username, password, nickname)
VALUES (
    1,
    'admin',
    '$2b$12$9.hdY8DAGbdktHGNRMpLkOtL0yIMpCqWt0PHucfwmBtVKfTV.Ce9e',
    'Bowen'
);

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
);

INSERT INTO category (id, name, sort)
VALUES
    (1, 'Java', 100),
    (2, 'Spring Boot', 90);

INSERT INTO tag (id, name)
VALUES
    (1, 'Java'),
    (2, 'Spring'),
    (3, 'Backend');
