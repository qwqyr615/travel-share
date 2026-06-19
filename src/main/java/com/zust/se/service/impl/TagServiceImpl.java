package com.zust.se.service.impl;

import com.zust.se.mapper.TagMapper;
import com.zust.se.model.Tag;
import com.zust.se.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Override
    public List<Tag> getAll() {
        return tagMapper.findAll();
    }

    @Override
    public Tag findById(Integer id) {
        return tagMapper.findById(id);
    }

    @Override
    public int add(Tag tag) {
        return tagMapper.insert(tag);
    }

    @Override
    public int update(Tag tag) {
        return tagMapper.update(tag);
    }

    @Override
    public int deleteById(Integer id) {
        return tagMapper.deleteById(id);
    }
}