import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MaskedInput, IMask } from 'antd-mask-input';
import { Form } from 'antd';

const stories = storiesOf('Components', module);

stories.add('Phone', () => (
  <>
    <MaskedInput
      mask={
        //  https://imask.js.org/guide.html#masked-pattern
        '+55(00)0000-0000'
      }
    />
  </>
));

stories.add('AMEX', () => (
  <>
    <MaskedInput mask={'0000 000000 00000'} />
  </>
));

export const InputPhoneComponent = (props: any) => {
  const cellphoneMask = '(00) 0 0000-0000';
  const phoneMask = '(00) 0000-0000';

  // always memoize dynamic masks
  const mask = React.useMemo(
    () => [
      {
        mask: cellphoneMask,
        lazy: false,
      },
      {
        mask: phoneMask,
        lazy: false,
      },
    ],
    []
  );

  return (
    <MaskedInput
      {...props}
      mask={mask}
      maskOptions={{
        dispatch: function (_appended, dynamicMasked) {
          const isCellPhone = dynamicMasked.unmaskedValue[2] === '9';
          return dynamicMasked.compiledMasks[isCellPhone ? 0 : 1];
        },
      }}
    />
  );
};

stories.add('Dynamic Mask', () => <InputPhoneComponent />);

stories.add('RGB', () => {
  const mask = React.useMemo<any>(() => {
    return [
      {
        mask: 'RGB,RGB,RGB',
        blocks: {
          RGB: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 255,
          },
        },
      },
      {
        mask: /^#[0-9a-f]{0,6}$/i,
      },
    ];
  }, []);

  return (
    <>
      <MaskedInput mask={mask} />
    </>
  );
});

window.formRef = {};

stories.add('useForm', () => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    const interval = setInterval(() => {
      form.setFieldsValue({phone: `${Math.random()*1000}`})
    }, 700);

    return () => clearInterval(interval)
  }, [])

  return <Form form={form}>
    <Form.Item
      label="Phone"
      name="phone"
      initialValue={'11'}
    >
      <InputPhoneComponent />
    </Form.Item>
  </Form>
});

//  https://imask.js.org/guide.html#masked-pattern
const DUMB_IP_MASK = '0[0][0].0[0][0].0[0][0].0[0][0]';

stories.add('IP', () => (
  <MaskedInput
    mask={DUMB_IP_MASK}
    value="192.16.1.5" //
  />
));


stories.add('Form', () => (
  <Form ref={(val) => (window.formRef = val)}>
    <Form.Item
      label="Username"
      name="username"
      initialValue={'123'}
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <InputPhoneComponent />
    </Form.Item>

    <button>Go</button>
  </Form>
));

declare global {
  interface Window {
    formRef: any;
  }
}