import React, {useEffect, useState} from "react";
import $ from "../../utils/my_axios";
import {Pagination} from "antd";

export interface CompPaginationProps {
  uri: string;
  setData: any;
}

export const CompPagination = (props: CompPaginationProps) => {
  const [total, setTotal] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    pagination().then((e) => {
      console.log("init data");
    });
  }, []);

  const pagination = async (pageNum: number = 1, pageSize: number = 10) => {
    const res = await $.get(
      `${props.uri}?skip=${(pageNum - 1) * pageSize}&limit=${pageSize}`
    );
    setTotal(res.data.data.total);
    setPageNum(pageNum);
    setPageSize(pageSize);
    props.setData(res.data.data.items);
    console.log(res.data);
  };
  return (
    <div style={{ width: "100%", margin: "10px", textAlign: "right" }}>
      <Pagination
        pageSize={pageSize}
        total={total}
        onChange={pagination}
        current={pageNum}
      />
    </div>
  );
};
