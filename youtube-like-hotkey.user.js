// ==UserScript==
// @name         YouTube Like Hotkey
// @namespace    https://youtube.com/
// @version      1.4
// @description  Add a configurable keyboard shortcut to like YouTube videos
// @match        https://www.youtube.com/*
// @updateURL    https://raw.githubusercontent.com/snape2019/youtube-like-hotkey/main/youtube-like-hotkey.user.js
// @downloadURL  https://raw.githubusercontent.com/snape2019/youtube-like-hotkey/main/youtube-like-hotkey.user.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_HOTKEY = 'g';
  const STORAGE_KEY = 'youtube_like_hotkey';

  function getHotkey() {
    return String(GM_getValue(STORAGE_KEY, DEFAULT_HOTKEY)).toLowerCase();
  }

  function setHotkey(key) {
    GM_setValue(STORAGE_KEY, key.toLowerCase());
  }

  function isTypingTarget(el) {
    if (!el) return false;

    const tag = el.tagName?.toLowerCase();

    return (
      tag === 'input' ||
      tag === 'textarea' ||
      el.isContentEditable ||
      el.closest?.('[contenteditable="true"]')
    );
  }

  function findLikeButton() {
    const segmentedLikeButton = document.querySelector(
      'ytd-segmented-like-dislike-button-renderer segmented-like-dislike-button-view-model like-button-view-model button'
    );

    if (segmentedLikeButton) return segmentedLikeButton;

    const likeButtonViewModel = document.querySelector(
      'like-button-view-model button, ytd-toggle-button-renderer:first-child button'
    );

    if (likeButtonViewModel && !isDislikeButton(likeButtonViewModel)) {
      return likeButtonViewModel;
    }

    const buttons = Array.from(document.querySelectorAll('button'));

    return buttons.find((button) => {
      if (isDislikeButton(button)) return false;

      const label = getButtonLabel(button);

      return (
        /like this video/i.test(label) ||
        /^like$/i.test(label) ||
        /我喜歡這部影片|喜歡這部影片|喜欢此视频|喜欢这个视频|点赞/i.test(label)
      );
    });
  }

  function getButtonLabel(button) {
    return [
      button.getAttribute('aria-label'),
      button.getAttribute('title'),
      button.textContent,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  function isDislikeButton(button) {
    const label = getButtonLabel(button);

    return /dislike|not interested|不喜欢|不喜歡|踩|倒赞|倒讚/i.test(label);
  }

  function isLiked(button) {
    const label = getButtonLabel(button);
    const pressed = button.getAttribute('aria-pressed');
    const container = button.closest(
      'like-button-view-model, ytd-toggle-button-renderer'
    );

    return (
      pressed === 'true' ||
      /unlike|remove like|取消点赞|取消喜歡|取消喜欢|移除喜歡|移除喜欢/i.test(label) ||
      container?.classList.contains('style-default-active') ||
      container?.querySelector('[aria-pressed="true"]') === button
    );
  }

  function showToast(message) {
    const oldToast = document.querySelector('#yt-like-hotkey-toast');
    oldToast?.remove();

    const toast = document.createElement('div');
    toast.id = 'yt-like-hotkey-toast';
    toast.textContent = message;

    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      bottom: '80px',
      transform: 'translateX(-50%)',
      zIndex: '999999',
      padding: '10px 16px',
      borderRadius: '8px',
      background: 'rgba(0, 0, 0, 0.86)',
      color: '#fff',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 1800);
  }

  function openSettings() {
    const current = getHotkey();

    const input = prompt(
      `请输入点赞快捷键，当前是：${current.toUpperCase()}\n\n建议只输入一个字母，例如 G、Q、Z。`,
      current.toUpperCase()
    );

    if (!input) return;

    const key = input.trim().toLowerCase();

    if (!/^[a-z0-9]$/.test(key)) {
      alert('快捷键只能是单个字母或数字。');
      return;
    }

    setHotkey(key);
    showToast(`YouTube 点赞快捷键已改为 ${key.toUpperCase()}`);
  }

  GM_registerMenuCommand('设置 YouTube 点赞快捷键', openSettings);

  document.addEventListener('keydown', (event) => {
    const hotkey = getHotkey();

    if (event.key.toLowerCase() !== hotkey) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (isTypingTarget(document.activeElement)) return;

    const likeButton = findLikeButton();

    if (likeButton) {
      event.preventDefault();
      if (isLiked(likeButton)) {
        showToast('已点赞');
        return;
      }

      likeButton.click();
      showToast('已点赞');
    }
  });
})();
