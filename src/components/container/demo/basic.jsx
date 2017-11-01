import React from 'react';
import ReactDOM from 'react-dom';
import WhiteSpace from '@gag/white-space';
import WingBlank from '@gag/wing-blank';
import Card from '../src';
ReactDOM.render(
  <WingBlank size="lg">
    <WhiteSpace size="lg" />
    <Card>
      <Card.Header
        title="这是 title"
        thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
        extra={<span>this is extra</span>}
      />
      <Card.Body>
        <div>这是卡片内容</div>
      </Card.Body>
      <Card.Footer content="这是卡尾" extra={<div>这是尾部介绍</div>} />
    </Card>
    <WhiteSpace size="lg" />
  </WingBlank>
, document.getElementById('sk-root'));
