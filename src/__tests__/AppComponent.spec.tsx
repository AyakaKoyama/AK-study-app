/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "../App";
//import { Record } from "../domain/record";


describe("App", () => {

    test("tableがあること", () => {
        render(<App />);
        const table = screen.getByTestId("table")
        expect(table).toBeInTheDocument();
    });

    test("titleがあること", async() => {
        render(<App />);
        //テーブル表示されるまで待機
        await waitFor(()=>screen.getByTestId("table"))
        const title = screen.getByTestId("title")
        expect(title).toBeInTheDocument();
    });

    test("Loadingがあること", async() => {
        render(<App />);
        await waitFor(()=>screen.getByTestId("table"))
        const loading = screen.getByTestId("loading")
        expect(loading).toBeInTheDocument();
    });

    test("column1が学習内容であること", async() => {
        render(<App />);
        await waitFor(()=>screen.getByTestId("table"))
        const column1 = screen.getByTestId("column1")
        expect(column1).toHaveTextContent("学習内容");
});
    test("column2が学習時間であること", async() => {
        render(<App />);
        await waitFor(()=>screen.getByTestId("table"))
        const column2 = screen.getByTestId("column2")
        expect(column2).toHaveTextContent("学習時間");
});
    test("新規登録ボタンがあること", async() => {
        render(<App />);
        await waitFor(()=>screen.getByTestId("table"))
        const newSubmit = screen.getByTestId("new-submit")
        expect(newSubmit).toHaveTextContent("新規登録");
});
    
    test("モーダルのtitleが表示されること", async() => {
        render(<App />);
        const newSubmitButton = screen.getByTestId("new-submit");
        fireEvent.click(newSubmitButton);
        await waitFor(()=>{
        const modalTitle = screen.getByTestId("modal-title")
        expect(modalTitle).toHaveTextContent("学習記録");
        })
});

    test("学習内容と学習時間を登録できる", async () => {
    render(<App />);
    await waitFor(()=>screen.getByTestId("modal-title"))

    // 学習内容と時間の入力フィールドを取得
    const contentInput = screen.getByTestId("study-content-input");
    const timeInput = screen.getByTestId("study-time-input");

    // 学習内容と時間を入力
    fireEvent.change(contentInput, { target: { value: "テスト学習内容" } });
    fireEvent.change(timeInput, { target: { value: "10" } });

    // 登録ボタンをクリック
    const submitButton = screen.getByTestId("submit");
    fireEvent.click(submitButton);

    // 新しい学習記録がリストに追加されたことを確認
    await waitFor(() => {
        const newRecord = screen.getByText("テスト学習内容 10時間");
        expect(newRecord).toBeInTheDocument();
    });
});



});