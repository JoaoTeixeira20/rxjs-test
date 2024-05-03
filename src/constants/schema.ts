import { TSchema } from "@/interfaces/schema";

const schema: TSchema = {
  component: "div",
  name: "container",
  props: {
    label: "container",
  },
  children: [
    {
      component: "datepicker",
      name: "datepickertest",
      props: {
        label: "datepicker",
        min: new Date(),
        max: new Date(new Date().setDate(new Date().getDate() + 120)),
      },
    },
    {
      component: "dropdown",
      name: "testdropdown",
      props: {
        label: "dropdown",
        optionList: [
          {
            id: "1",
            label: "1",
            name: "1",
          },
          {
            id: "2",
            label: "2",
            name: "2",
          },
          {
            id: "3",
            label: "3",
            name: "3",
          },
        ],
      },
    },
    {
      component: "libinput",
      name: "name",
      props: {
        label: "name",
        variant: "grey",
      },
      validations: {
        input: {
          max: 18,
          min: 16,
          required: true,
        },
        blur: {
          max: 18,
          min: 16,
          required: true,
        },
      },
      visibilityConditions: {
        input: [
          {
            validations: {
              max: 18,
            },
            fields: ["foo", "bar"],
          },
        ],
      },
      resetValues: {
        input: [
          {
            validations: {
              max: 18,
            },
            fields: ["baz", "bal"],
            resettedFields: ["bazzilic", "ballistic"],
          },
        ],
      },
      api: {
        input: {
          method: "GET",
          url: "https://api.chucknorris.io/jokes/random",
          valuePath: "value",
        },
      },
      errorMessages: {
        max: "max value reached",
        min: "min value reached",
        required: "field required",
      },
    },
    {
      component: "div",
      name: "anothercontainer",
      props: {
        label: "anothercontainer",
      },
      children: [
        {
          component: "libinput",
          name: "phone",
          props: {
            label: "phone",
          },
        },
        {
          component: "div",
          name: "foobarbaz",
          props: {
            label: "foobarbaz",
          },
          children: [
            {
              component: "libinput",
              name: "foo",
              props: {
                label: "foo",
              },
              visibilityConditions: {
                input: [
                  {
                    validations: {
                      max: 18,
                    },
                    fields: "bar",
                  },
                ],
              },
            },
            {
              component: "libinput",
              name: "bar",
              props: {
                label: "bar",
              },
            },
            {
              component: "libinput",
              name: "baz",
              props: {
                label: "baz",
              },
            },
            {
              component: "libinput",
              name: "bal",
              props: {
                label: "bal",
              },
            },
          ],
        },
      ],
    },
    {
      component: "libinput",
      name: "surname",
      props: {
        label: "surname",
      },
    },
  ],
};

export { schema };
