/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
  `<template>
    <style>
    :root {
      --primary-color-100:rgb(0, 107, 255,1);
      --primary-color-30:rgb(0, 107, 255,0.3);
      --primary-color-10:rgb(0, 107, 255,0.1);
      --primary-color-5:rgb(0, 107, 255,0.05);
      --primary-color-light:#2E86FF;
      --primary-color-dark:#0058D1;
  
      --success-color:#36B37E;
      --warning-color:#FFAB00;
      --error-color:#F04646;
  
      --primary-text:rgba(0,0,0,0.87);
      --secondary-text:rgba(0,0,0,0.54);
      --disabled-text:rgba(0,0,0,0.38);
      --divider-color:rgba(0,0,0,0.12);
  
      --border-color : rgba(0,0,0,0.12);
    }
  
    :root.dark-theme{
      --primary-text:rgba(255,255,255,0.87);
      --secondary-text:rgba(255,255,255,0.54);
      --disabled-text:rgba(255,255,255,0.38);
      --divider-text:rgba(255,255,255,0.12);
    }

    .oe-material-header-1{
      font-size:96px;
      letter-spacing:-1.5px;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-header-2{
      font-size:60px;
      letter-spacing:-0.49px;
      font-family:Lato;
      font-weight: 300;
    }

    .oe-material-header-3{
      font-size:48px;
      letter-spacing:0px;
      font-family:Lato;
    }

    .oe-material-header-4{
      font-size:34px;
      letter-spacing:0.25px;
      font-family:Lato;
    }

    .oe-material-heading-5{
      font-size:24px;
      letter-spacing:0px;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-heading-6{
      font-size:20px;
      letter-spacing:0.25px;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-body-1{
      font-size:16px;
      letter-spacing:0.49px;
      font-family:Lato;
    }

    .oe-material-body-2{
      font-size:14px;
      letter-spacing:0.25px;
      font-family:Lato;
    }

    .oe-material-subtitle-1{
      font-size:16px;
      letter-spacing:0.15px;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-subtitle-2{
      font-size:14px;
      letter-spacing:0.1px;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-button-label{
      font-size:14px;
      letter-spacing:1.23px;
      text-transform: uppercase;
      font-family:Lato;
      font-weight:bold;
    }

    .oe-material-caption{
      font-size:12px;
      letter-spacing:0.39px;
      font-family:Lato;
    }

    .oe-material-overline{
      font-size:11px;
      letter-spacing:1.8px;
      font-family:Lato;
      font-weight:bold;
    }
    
    .oe-material-btn{
      height:40px;
      border-radius:4px;
      padding:0px 16px;
    }

    .oe-material-btn:focus{
      box-shadow: 0 0 0 1px var(--primary-color-light);
    }

    .oe-material-large-btn{
      height:56px;
      border-radius:4px;
      padding:0px 16px;
    }


    .oe-material-btn[primary]{
      color:#FFFFFF;
      --paper-button:{
        background:var(--primary-color-100);
      }
      --paper-button-disabled:{
        background:rgba(0,0,0,0.14);
      }
    }

    .oe-material-btn.warning-btn[primary]{
      --paper-button:{
        background:var(--warning-color);
      }
    }

    .oe-material-btn.error-btn[primary]{
      --paper-button:{
        background:var(--error-color);
      }
    }


    .oe-material-btn[secondary]{
      --paper-button:{
        background:transparent;
        color:var(--primary-color-100);
      }
      --paper-button-disabled:{
        background:transparent;
        color:var(--disabled-text);
      }
    }

    .oe-material-btn:hover[secondary]{
      --paper-button:{
        background:var(--primary-color-10);
        color:var(--primary-color-100);
      }
    }

    .oe-material-btn.warning-btn[secondary]{
      --paper-button:{
        color:var(--warning-color);
      }
    }

    .oe-material-btn.error-btn[secondary]{
      --paper-button:{
        color:var(--error-color);
      }
    }

    .oe-material-outline-btn{
      --paper-button:{
        border:1px solid var(--border-color);
        background:transparent;
        color:var(--primary-text);
      }
      --paper-button-disabled:{
        border:1px solid var(--border-color);
        background:transparent;
        color:var(--disabled-text);
      }
    }

    .oe-material-outline-btn:hover{
      --paper-button:{
        border:1px solid var(--border-color);
        background:var(--primary-color-10);
        color:var(--primary-color-100);
      }
    }

    .oe-material-outline-btn:focus{
      --paper-button:{
        border:1px solid var(--primary-color-100);
        color:var(--primary-color-100);
      }
    }

    .oe-material-outline-btn.warning-btn{
      --paper-button:{
        border:1px solid var(--warning-color);
        color:var(--warning-color);
      }
    }

    .oe-material-outline-btn.error-btn{
      --paper-button:{
        border:1px solid var(--error-color);
        color:var(--error-color);
      }
    }

    .oe-material-checkbox{
      --paper-checkbox-label-color:var(--primary-text);
      --paper-checkbox-unchecked-color:var(--secondary-text);
      --paper-checkbox-checked-color:var(--primary-color-light);
    }

    .oe-material-slider{
      --paper-progress-active-color:var(--primary-color-light);
      --paper-slider-knob-color:var(--primary-color-100);
    }

    .oe-material-slider:hover{
      --paper-progress-height:4px;
      --calculated-paper-slider-height:4px;
    }

    .oe-material-toggle{
      --paper-toggle-button-checked-bar-color:  var(--primary-color-30);
      --paper-toggle-button-checked-button-color:  var(--primary-color-100);
      --paper-toggle-button-checked-ink-color: var(--primary-color-100);
    }


    </style>
  </template>`;
styleElement.register('oe-material-styles'); 