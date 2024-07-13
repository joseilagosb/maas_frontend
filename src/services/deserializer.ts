import { Deserializer } from 'jsonapi-serializer'

export const JSONDeserializer = new Deserializer({
  id: 'id',
  keyForAttribute: 'camelCase',
  pluralizeType: false,
  typeAsAttribute: true
})
