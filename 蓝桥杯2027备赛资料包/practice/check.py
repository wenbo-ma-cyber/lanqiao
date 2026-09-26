#!/usr/bin/env python3
"""原创入门练习的有限自测工具；不是官方判题器。"""

import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parent
TIMEOUT_SECONDS = 2


def short(text):
    """限制错误提示长度，避免完整日志淹没结果。"""
    return repr(text[:240]) + ("……（截断）" if len(text) > 240 else "")


def check_case(script, case):
    try:
        result = subprocess.run(
            [sys.executable, str(script)],
            input=case["input"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=TIMEOUT_SECONDS,
            cwd=script.parent,
        )
    except subprocess.TimeoutExpired:
        return False, f"超时：单个用例超过 {TIMEOUT_SECONDS} 秒"
    except OSError as exc:
        return False, f"无法启动程序：{exc}"
    if result.returncode != 0:
        return False, f"运行错误（退出码 {result.returncode}）：{short(result.stderr)}"
    if result.stdout.split() != case["output"].split():
        return False, (
            f"输出不匹配\n  输入：{short(case['input'])}\n"
            f"  期望：{short(case['output'])}\n  实际：{short(result.stdout)}"
        )
    return True, "通过"


def check_problem(problem_id, script, cases):
    passed = 0
    for index, case in enumerate(cases, 1):
        ok, detail = check_case(script, case)
        if ok:
            passed += 1
        else:
            print(f"{problem_id} 用例 {index}：{detail}")
    print(f"{problem_id}：{passed}/{len(cases)} 组有限自测通过")
    return passed == len(cases)


def main():
    parser = argparse.ArgumentParser(
        description="每个用例限时 2 秒，按空白分隔后的 token 比较输出；不是官方判题。"
    )
    parser.add_argument("problem_id", nargs="?", help="题号，例如 W01-01")
    parser.add_argument("script", nargs="?", help="你编写的 Python 文件路径")
    parser.add_argument("--self-test", action="store_true", help="核验全部参考实现")
    args = parser.parse_args()
    cases = json.loads((ROOT / "cases.json").read_text(encoding="utf-8"))

    if args.self_test:
        if args.problem_id is not None or args.script is not None:
            parser.error("--self-test 不能与题号或脚本路径同时使用")
        references = json.loads((ROOT / "answers.json").read_text(encoding="utf-8"))
        if set(references) != set(cases):
            parser.error("答案与测试数据的题号不一致")
        success = True
        # 临时参考文件仅用于执行自测，退出此作用域后自动清理。
        with tempfile.TemporaryDirectory(prefix=".reference-test-", dir=ROOT) as temp:
            script = Path(temp) / "reference.py"
            for problem_id in sorted(cases):
                script.write_text(references[problem_id], encoding="utf-8")
                if not check_problem(problem_id, script, cases[problem_id]):
                    success = False
        total = sum(len(group) for group in cases.values())
        print(f"参考实现核验：{len(cases)} 题，{total} 组用例。")
    else:
        if args.problem_id is None or args.script is None:
            parser.error("请提供题号与 Python 文件路径，或单独使用 --self-test")
        problem_id = args.problem_id.upper()
        if problem_id not in cases:
            parser.error("未知题号；有效范围为 W01-01～W04-08，每周 8 题")
        script = Path(args.script).expanduser().resolve()
        if not script.is_file():
            parser.error(f"脚本文件不存在：{script}")
        success = check_problem(problem_id, script, cases[problem_id])

    print("有限自测不能证明程序对所有输入正确；请补充边界用例并解释解法。")
    return 0 if success else 1


if __name__ == "__main__":
    raise SystemExit(main())
