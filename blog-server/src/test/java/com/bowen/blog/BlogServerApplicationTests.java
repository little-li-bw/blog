package com.bowen.blog;

import com.bowen.blog.auth.mapper.AdminUserMapper;
import com.bowen.blog.category.mapper.CategoryMapper;
import com.bowen.blog.post.mapper.PostMapper;
import com.bowen.blog.post.mapper.PostTagMapper;
import com.bowen.blog.site.mapper.SiteConfigMapper;
import com.bowen.blog.tag.mapper.TagMapper;
import com.bowen.blog.upload.mapper.UploadFileMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BlogServerApplicationTests {

    @MockBean
    private AdminUserMapper adminUserMapper;

    @MockBean
    private CategoryMapper categoryMapper;

    @MockBean
    private TagMapper tagMapper;

    @MockBean
    private SiteConfigMapper siteConfigMapper;

    @MockBean
    private PostMapper postMapper;

    @MockBean
    private PostTagMapper postTagMapper;

    @MockBean
    private UploadFileMapper uploadFileMapper;

    @Test
    void contextLoads() {
    }
}
