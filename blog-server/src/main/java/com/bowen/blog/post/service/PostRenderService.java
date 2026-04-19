package com.bowen.blog.post.service;

import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

@Service
public class PostRenderService {

    private final Parser parser;
    private final HtmlRenderer renderer;

    public PostRenderService() {
        this.parser = Parser.builder().build();
        this.renderer = HtmlRenderer.builder().escapeHtml(false).build();
    }

    public String render(String markdown) {
        if (markdown == null || markdown.trim().isEmpty()) {
            return "";
        }

        String html = renderer.render(parser.parse(markdown));
        return Jsoup.clean(html, "", Safelist.relaxed().addTags("pre", "code").addAttributes(":all", "class"), new org.jsoup.nodes.Document.OutputSettings().prettyPrint(false));
    }
}
