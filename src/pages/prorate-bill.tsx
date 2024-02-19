import { useState } from 'react';
import { NextPage } from 'next';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';

enum OtherFeeMethod {
    PRORATE = 'prorated',
    EQUAL = 'equally',
}

interface OtherFee {
    id: string;
    name: string;
    amount: number;
    method: OtherFeeMethod;
}

interface BillItem {
    id: string;
    name: string;
    amount: number;
}

interface BillValue {
    totalAmountBeforeDiscount: number;
    otherFees: OtherFee[];
    totalAmountAfterDiscount: number;
    items: BillItem[];
}

type BillResult = {
    id: string;
    name: string;
    discount: number;
    proratedPercentage: number;
    amountBeforeDiscount: number;
    amountAfterDiscount: number;
    otherFees: OtherFee[];
    finalAmount: number;
}[];

const otherFeeMethodOptions = [
    {
        label: 'Prorated',
        value: OtherFeeMethod.PRORATE,
    },
    {
        label: 'Equally',
        value: OtherFeeMethod.EQUAL,
    },
];

const ProrateBill: NextPage = () => {
    const [form] = Form.useForm<BillValue>();
    const [result, setResult] = useState<BillResult | null>(null);

    const onCalculate = () => {
        form.validateFields().then((values) => {
            const { totalAmountBeforeDiscount, totalAmountAfterDiscount, items } = values;

            const numberOfItems = items.length;

            const result = items.map((item) => {
                const prorate = item.amount / totalAmountBeforeDiscount;
                const amountAfterDiscount = totalAmountAfterDiscount * prorate;
                const discount = item.amount - amountAfterDiscount;

                const otherFees = (values.otherFees ?? []).map((otherFee: OtherFee) => {
                    const { method, amount } = otherFee;
                    let otherFeeAmount = 0;

                    if (method === OtherFeeMethod.PRORATE) {
                        otherFeeAmount = amount * prorate;
                    } else {
                        otherFeeAmount = amount / numberOfItems;
                    }

                    return {
                        ...otherFee,
                        amount: otherFeeAmount,
                    };
                });

                return {
                    id: item.id,
                    name: item.name,
                    amountBeforeDiscount: item.amount,
                    amountAfterDiscount,
                    discount,
                    proratedPercentage: prorate * 100,
                    otherFees,
                    finalAmount: amountAfterDiscount + otherFees.reduce((acc, otherFee) => acc + otherFee.amount, 0),
                };
            });

            setResult(result);
        });
    };

    return (
        <div>
            <div className="py-6 w-full flex justify-center">
                <h1 className="font-bold text-3xl">Prorate Bill</h1>
            </div>
            <div className="flex px-10 gap-10">
                <div className="w-1/2">
                    <Form form={form} layout="vertical">
                        <Form.Item name="totalAmountBeforeDiscount" label="Total Amount before Discount">
                            <InputNumber size="large" className="w-full" placeholder="0.00" addonBefore="RM" />
                        </Form.Item>
                        <h2 className="font-bold text-xl">Other Fees</h2>
                        <Form.List name="otherFees">
                            {(fields, { add, remove }) => (
                                <>
                                    <div className="flex flex-col gap-5 mb-5">
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <div className="border border-solid border-gray-500/30 p-5 rounded" key={key}>
                                                <div className="flex justify-end mb-5">
                                                    <DeleteOutlined className="text-lg text-red-500 cursor-pointer" onClick={() => remove(index)} />
                                                </div>
                                                <Form.Item name={[name, 'name']}>
                                                    <Input placeholder="Service Tax" />
                                                </Form.Item>
                                                <Form.Item name={[name, 'amount']}>
                                                    <InputNumber className="w-full" placeholder="0.00" addonBefore="RM" />
                                                </Form.Item>
                                                <Form.Item name={[name, 'method']} label="Method" initialValue={OtherFeeMethod.PRORATE}>
                                                    <Select options={otherFeeMethodOptions} />
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        block
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                id: uuidv4(),
                                                name: '',
                                                amount: 0,
                                                method: OtherFeeMethod.PRORATE,
                                            })
                                        }
                                        icon={<PlusOutlined />}
                                    >
                                        Add Other Fee
                                    </Button>
                                </>
                            )}
                        </Form.List>
                        <Divider />
                        <h2 className="font-bold text-xl">Bill Items</h2>
                        <Form.List name="items">
                            {(fields, { add, remove }) => (
                                <>
                                    <div className="flex flex-col gap-5 mb-5">
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <div className="border border-solid border-gray-500/30 p-5 rounded" key={key}>
                                                <div className="flex justify-end mb-5">
                                                    <DeleteOutlined className="text-lg text-red-500 cursor-pointer" onClick={() => remove(index)} />
                                                </div>
                                                <Form.Item name={[name, 'name']}>
                                                    <Input placeholder="John Doe" />
                                                </Form.Item>
                                                <Form.Item name={[name, 'amount']}>
                                                    <InputNumber className="w-full" placeholder="0.00" addonBefore="RM" />
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        block
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                id: uuidv4(),
                                                name: '',
                                                amount: 0,
                                            })
                                        }
                                        icon={<PlusOutlined />}
                                    >
                                        Add New Item
                                    </Button>
                                </>
                            )}
                        </Form.List>
                        <Form.Item name="totalAmountAfterDiscount" label="Total Amount after Discount" className="mt-10">
                            <InputNumber size="large" className="w-full" placeholder="0.00" addonBefore="RM" />
                        </Form.Item>
                        <Button type="primary" block onClick={onCalculate} className="mt-5" size="large">
                            Calculate
                        </Button>
                    </Form>
                </div>
                <div className="w-1/2">
                    <h2 className="font-bold text-xl">Result</h2>
                    <div className="flex flex-col gap-5 mt-5">
                        {result?.map((item) => (
                            <div key={item.id} className="border border-solid border-gray-500/30 p-5 rounded">
                                <div>
                                    <div className="font-bold text-xl">
                                        {item.name} ({item.proratedPercentage.toFixed(2)}%)
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Amount before discount</div>
                                    <div>RM {item.amountBeforeDiscount.toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Discount</div>
                                    <div className="text-green-500">RM {item.discount.toFixed(2)}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div>Amount after discount</div>
                                    <div>RM {item.amountAfterDiscount.toFixed(2)}</div>
                                </div>
                                {item.otherFees.length > 0 && (
                                    <div className="flex justify-between">
                                        <div>Other Fees</div>
                                        <div>
                                            {(item.otherFees ?? []).map((otherFee) => (
                                                <div key={otherFee.id} className="text-right">
                                                    ({otherFee.name}) RM {otherFee.amount.toFixed(2)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <div>Final Amount</div>
                                    <div className="font-bold">RM {item.finalAmount.toFixed(2)}</div>
                                </div>
                            </div>
                        ))}
                        {result && (
                            <div>
                                Total Items Amount before discount:
                                <span className="font-bold ml-2">RM {result.reduce((acc, item) => acc + item.amountBeforeDiscount, 0)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProrateBill;
