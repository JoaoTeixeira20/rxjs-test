import { ISchema } from '@/interfaces/schema';

const schema: ISchema[] = [{
  component: 'div',
  name: 'container',
  props: {
    label: '${bal.value}',
  },
  children: [
    {
      component: 'datepicker',
      name: 'datepickertest',
      props: {
        label: 'datepicker',
        min: new Date(),
        max: new Date(new Date().setDate(new Date().getDate() + 120)),
      },
      api: {
        config: {
          method: 'GET',
          url: 'http://localhost:3023/plan/address/provinces',
          resultPath: 'result',
          fallbackValue: [],
        },
        events: ['ON_FIELD_MOUNT'],
      },
    },
    {
      component: 'dropdown',
      name: 'provinces',
      props: {
        label: 'provinces',
        optionList: '${datepickertest.apiResponseData.response||[]}',
      },
    },
    {
      component: 'dropdown',
      name: 'testdropdown',
      props: {
        label: 'çup?',
        optionList: [
          {
            id: 'one',
            label: 'one',
            value: '1',
          },
          {
            id: 'two',
            label: 'two',
            value: '2',
          },
          {
            id: 'three',
            label: 'three',
            value: '3',
          },
        ],
      },
    },
    {
      component: 'libinput',
      name: 'name',
      props: {
        label:
          '${name.apiResponseData.response||testdropdown.props.label} and ${name.apiResponseData.response||testdropdown.props.label}',
        variant: 'border',
        // errorMessage: '${name.errorsString}'
      },
      validations: {
        ON_FIELD_CHANGE: {
          max: 18,
          min: 16,
          required: true,
        },
        ON_FIELD_BLUR: {
          max: 18,
          min: 16,
          required: true,
        },
      },
      visibilityConditions: {
        ON_FIELD_CHANGE: [
          {
            validations: {
              max: 18,
            },
            fields: ['foo', 'bar'],
          },
        ],
      },
      resetValues: {
        ON_FIELD_CHANGE: [
          {
            validations: {
              max: 18,
            },
            fields: ['baz', 'bal'],
            resettedFields: ['bazzilic', 'ballistic'],
          },
        ],
      },
      api: {
        config: {
          method: 'GET',
          url: 'https://api.chucknorris.io/jokes/random',
          // url: "https://google.com",
          headers: {
            'access-control-allow-origin': '*',
          },
          resultPath: 'value',
          fallbackValue: '',
        },
        events: ['ON_FIELD_CHANGE'],
      },
      errorMessages: {
        max: 'max value reached',
        min: 'min value reached',
        required: 'field required',
      },
      formatters: { capitalize: true, dotEvery3chars: true },
    },
    {
      component: 'div',
      name: 'anothercontainer',
      props: {
        label: '${name.props.label}',
      },
      children: [
        {
          component: 'libinput',
          name: 'phone',
          props: {
            label: 'phone',
          },
        },
        {
          component: 'div',
          name: 'foobarbaz',
          props: {
            label: 'foobarbaz',
          },
          children: [
            {
              component: 'libinput',
              name: 'foo',
              props: {
                label: 'foo',
              },
              visibilityConditions: {
                ON_FIELD_CHANGE: [
                  {
                    validations: {
                      max: 18,
                    },
                    fields: 'bar',
                  },
                ],
              },
            },
            {
              component: 'libinput',
              name: 'bar',
              props: {
                label: 'bar',
              },
            },
            {
              component: 'libinput',
              name: 'baz',
              props: {
                label: '${baz.value}',
              },
            },
            {
              component: 'libinput',
              name: 'bal',
              props: {
                label: '${surname.props.label}',
                variant: 'grey',
              },
            },
          ],
        },
      ],
    },
    {
      component: 'libinput',
      name: 'surname',
      props: {
        label: '${name.value}',
      },
      validations: {
        ON_FIELD_BLUR: {
          max: 18,
          min: 16,
        },
      },
      errorMessages: {
        max: 'max reached',
        min: 'min reached',
      },
    },
    {
      component: 'libinput',
      name: 'Price',
      props: {
        label: 'Set your price',
      },
      formatters: {
        onlyFloatNumber: {},
      },
      masks: {
        currency: {
          prefix: 'EUR'
        }
      }
    },
  ],
}];

export { schema };
