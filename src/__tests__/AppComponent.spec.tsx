/**
 * @jest-environment jsdom
 */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "../App";
import { Record } from "../domain/record";

//モック化
const mockGetAllRecords = jest
.fn()
.mockResolvedValue([ new Record("1", "テスト", 3, "2024-03-16 09:30:48.200885")]  )
jest.mock("../utils/supabaseFunctions", ()=>{
    return{
        getAllRecords:()=>mockGetAllRecords(),
    }})

const mockDeleteRecords = jest
.fn()
.mockResolvedValue([]);
jest.mock("../utils/supabaseFunctions", () => {
    return{
        deleteRecords: () => mockDeleteRecords(),
    }});

describe("App", () => {

    test("tableがあること", () => {
        render(<App />);
        const table = screen.getByTestId("table")
        expect(table).toBeInTheDocument();
    });

    test("titleがあること", async() => {
        render(<App />);
        const title = screen.getByTestId("title")
        expect(title).toBeInTheDocument();
    });

    test("Loadingがあること", async() => {
        render(<App />);
        await waitFor(()=>screen.getByTestId("table"))
        //await waitFor(() => screen.getByTestId("loading"));
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
        
        //登録ボタンを押してモーダル表示
        const newSubmitButton = screen.getByTestId("new-submit");
        fireEvent.click(newSubmitButton);
        screen.getByTestId("modal-title")
        
        //モックを使ってデータを取得
        await waitFor(()=>screen.getByTestId("table"))
        const records = screen.getByTestId("table").querySelectorAll("tr")
        expect(records.length-1).toBe(1)
});
    test("学習内容の入力をしないで登録を押すとエラーが表示される", async() => {
        render(<App />)
        // モーダル表示～登録ボタン押下
        const newSubmitButton = screen.getByTestId("new-submit");
        fireEvent.click(newSubmitButton);
        screen.getByTestId("modal-title")
        const submitButton = screen.getByTestId("submit");
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.queryByText('内容の入力は必須です');
            expect(errorMessage).toBeInTheDocument();
        });
})

    test("学習時間の入力をしないで登録を押すとエラーが表示される", async() => {
        render(<App />)
        // モーダル表示～登録ボタン押下
        const newSubmitButton = screen.getByTestId("new-submit");
        fireEvent.click(newSubmitButton);
        screen.getByTestId("modal-title")
        const submitButton = screen.getByTestId("submit");
        fireEvent.click(submitButton);

        await waitFor(() => {
            const errorMessage = screen.queryByText('0以上で入力してください');
            expect(errorMessage).toBeInTheDocument();
        });
})

    test("削除ボタンを押すと学習記録が削除される", async () => {
        render(<App />);

        await waitFor(()=>screen.getByTestId("table"))

        // 削除ボタンが表示されるまで待機
        await waitFor(() => {
            const deleteButtons = screen.getAllByTestId("delete");
            expect(deleteButtons.length).toBeGreaterThan(0);
        });

        // 初期の学習記録の数を取得
        const initialRecords = screen.getAllByTestId("table");

        // 削除ボタンクリック
        const deleteButton = screen.getAllByTestId("delete")[0];
        fireEvent.click(deleteButton);

        // モック化されたdeleteRecords関数が呼び出されたことを確認
        expect(mockDeleteRecords).toHaveBeenCalled();

        // 削除後の学習記録の数を取得
        await waitFor(() => {
            const updatedRecords = screen.queryAllByTestId("table");
            expect(updatedRecords.length).toBe(initialRecords.length - 1);
        });
    });

});