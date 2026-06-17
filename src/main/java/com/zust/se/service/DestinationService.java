package com.zust.se.service;

import com.zust.se.model.Destination;

import java.util.List;

public interface DestinationService {
    List<Destination> getAll();
    Destination findById(Integer id);
    int add(Destination destination);
    int update(Destination destination);
    int deleteById(Integer id);
}
