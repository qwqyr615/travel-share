package com.zust.se.service;

import com.zust.se.model.Tag;

import java.util.List;

public interface TagService {
    List<Tag> getAll();
    Tag findById(Integer id);
    int add(Tag tag);
    int update(Tag tag);
    int deleteById(Integer id);
}