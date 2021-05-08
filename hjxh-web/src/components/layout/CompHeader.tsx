import { Header } from "antd/lib/layout/layout";
import { URL_API_DOCS } from "../../const";
import { Breadcrumb, Button, message, Space } from "antd";
import { MyIcons } from "../antd_icons";
import React from "react";

export function CompHeader(props: { breadcrumb: string[] }) {
  return (
    <Header
      style={{
        width: "100%",
        height: "50px",
        background: "white",
        zIndex: 1,
        position: 'sticky',
        top: 0
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb>
          {props.breadcrumb.map((b) => (
            <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
          ))}
        </Breadcrumb>

        <Space
          size={"large"}
          direction={"horizontal"}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <Button type={"primary"}>
            <a href={URL_API_DOCS} target={"_blank"} rel={"noreferrer"}>
              API
            </a>
          </Button>

          <MyIcons
            type={"icon-message"}
            style={{ fontSize: 20 }}
            id={"messages"}
            onClick={() => message.warn({ content: "消息系统待开发中~" })}
          />
          <MyIcons
            type={"icon-feedback"}
            style={{ fontSize: 20 }}
            id={"help"}
            onClick={() => message.warn({ content: "反馈系统待开发中~" })}
          />
          <MyIcons
            type={"icon-settings"}
            style={{ fontSize: 20 }}
            id={"settings"}
            onClick={() => message.warn({ content: "设置系统待开发中~" })}
          />
          <MyIcons
            type={"icon-member"}
            style={{ fontSize: 20 }}
            id={"accounts"}
            onClick={() => message.warn({ content: "账号系统待开发中~" })}
          />
        </Space>
      </div>
    </Header>
  );
}