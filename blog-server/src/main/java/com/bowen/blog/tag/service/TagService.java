package com.bowen.blog.tag.service;

import com.bowen.blog.tag.entity.Tag;
import com.bowen.blog.tag.mapper.TagMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TagService {

    private final TagMapper tagMapper;

    public TagService(TagMapper tagMapper) {
        this.tagMapper = tagMapper;
    }

    public Tag createTag(Tag request) {
        validateName(request);
        ensureTagNameAvailable(request.getName(), null);

        Tag tag = new Tag();
        tag.setName(request.getName().trim());
        tagMapper.insert(tag);
        return tag;
    }

    public List<Tag> listTags() {
        return tagMapper.findAllOrderByNameAscIdAsc();
    }

    public Tag updateTag(Long id, Tag request) {
        validateName(request);

        Tag existing = tagMapper.findById(id);
        if (existing == null) {
            throw new NoSuchElementException("Tag not found");
        }

        ensureTagNameAvailable(request.getName(), id);
        existing.setName(request.getName().trim());
        tagMapper.updateById(existing);
        return existing;
    }

    public void deleteTag(Long id) {
        Tag existing = tagMapper.findById(id);
        if (existing == null) {
            throw new NoSuchElementException("Tag not found");
        }

        tagMapper.deleteById(id);
    }

    private void validateName(Tag request) {
        if (request == null || request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tag name must not be blank");
        }
    }

    private void ensureTagNameAvailable(String name, Long currentTagId) {
        Tag existing = tagMapper.findByName(name.trim());
        if (existing != null && !existing.getId().equals(currentTagId)) {
            throw new IllegalArgumentException("Tag name already exists");
        }
    }
}
