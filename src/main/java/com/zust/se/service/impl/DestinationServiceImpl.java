package com.zust.se.service.impl;

import com.zust.se.mapper.DestinationMapper;
import com.zust.se.mapper.UserMapper;
import com.zust.se.model.Destination;
import com.zust.se.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DestinationServiceImpl implements DestinationService {
    @Autowired
    private DestinationMapper destinationMapper;

    @Override
    public List<Destination> getAll() {
        return destinationMapper.findAll();
    }

    @Override
    public Destination findById(Integer id) {
        return destinationMapper.findById(id);
    }

    @Override
    public int add(Destination destination) {
        return destinationMapper.insert(destination);
    }

    @Override
    public int update(Destination destination) {
        return destinationMapper.update(destination);
    }

    @Override
    public int deleteById(Integer id) {
        return destinationMapper.deleteById(id);
    }
}
