package com.zust.se.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping({"/", "/index", "/index.html"})
    public String forwardRoot() {
        return "forward:/static/index.html";
    }

    @RequestMapping({"/{segment:^(?!api$)(?!static$)[^\\.]+}", "/{segment:^(?!api$)(?!static$)[^\\.]+}/**"})
    public String forwardSpa() {
        return "forward:/static/index.html";
    }
}

