import { TSchema } from "@/interfaces/schema";

const schema: TSchema = {
  component: "div",
  name: "container",
  props: {
    label: "container",
  },
  children: [
    {
      component: "input",
      name: "name",
      props: {
        label: "name",
      },
      validations: {
        input: {
          max: 16,
          min: 18,
          required: true,
        },
        blur: {
          foo: 16,
          bar: 18,
          baz: true,
        },
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
          component: "input",
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
              component: "input",
              name: "foo",
              props: {
                label: "foo",
              },
            },
            {
              component: "input",
              name: "bar",
              props: {
                label: "bar",
              },
            },
            {
              component: "input",
              name: "baz",
              props: {
                label: "baz",
              },
            },
            {
              component: "input",
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
      component: "input",
      name: "surname",
      props: {
        label: "surname",
      },
    },
  ],
};

export { schema };
