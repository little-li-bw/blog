package com.bowen.blog.post.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("文章渲染服务单元测试")
class PostRenderServiceTest {

    private final PostRenderService postRenderService = new PostRenderService();

    @Test
    @DisplayName("渲染 Markdown - 标题和段落成功转换")
    void testRender_WhenMarkdownIsValid_ReturnsHtml() {
        String markdown = """
                # Title

                Hello Blog
                """;

        String html = postRenderService.render(markdown);

        assertThat(html).contains("<h1>Title</h1>");
        assertThat(html).contains("<p>Hello Blog</p>");
    }

    @Test
    @DisplayName("渲染 Markdown - 代码块保留语言标记")
    void testRender_WhenMarkdownContainsCodeBlock_ReturnsCodeHtml() {
        String markdown = """
                ```java
                System.out.println("hello");
                ```
                """;

        String html = postRenderService.render(markdown);

        assertThat(html).contains("<pre><code");
        assertThat(html).contains("language-java");
        assertThat(html).contains("System.out.println");
    }

    @Test
    @DisplayName("渲染 Markdown - 空内容返回空字符串")
    void testRender_WhenMarkdownIsBlank_ReturnsEmptyString() {
        assertThat(postRenderService.render("   ")).isEmpty();
        assertThat(postRenderService.render(null)).isEmpty();
    }

    @Test
    @DisplayName("渲染 Markdown - 危险脚本标签被过滤")
    void testRender_WhenMarkdownContainsScript_StripsScriptTag() {
        String markdown = """
                <script>alert('xss')</script>

                Safe Text
                """;

        String html = postRenderService.render(markdown);

        assertThat(html).doesNotContain("<script>");
        assertThat(html).doesNotContain("alert('xss')");
        assertThat(html).contains("Safe Text");
    }
}
