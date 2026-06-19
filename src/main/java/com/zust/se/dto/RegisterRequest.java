package com.zust.se.dto;

public class RegisterRequest {
    private String regName;
    private String password;
    private String nickname;

    public String getRegName() { return regName; }
    public void setRegName(String regName) { this.regName = regName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}