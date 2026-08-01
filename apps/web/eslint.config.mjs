import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    settings: {
      react: {
        version: '19.2.5',
      },
    },
  },
]

export default config
