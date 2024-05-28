import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginImport from 'eslint-plugin-import';
import pluginHooks from 'eslint-plugin-react-hooks';

export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReactConfig,
    pluginPrettierRecommended,
    //pluginImport.configs.recommended,
    //pluginImport.configs.typescript,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['src/public/*'],
        languageOptions: {
            ecmaVersion: 2020,
            /*ecmaFeatures: {
                jsx: true,
            },*/
            sourceType: 'module',
            globals: { ...globals.browser, ...globals.node },
        },
        plugins: {
            'react-hooks': pluginHooks, // skriv om denne når pluginen støtter flat config bedre https://github.com/facebook/react/issues/28313
            import: pluginImport,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/ignore': ['node_modules'],
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            'no-case-declarations': 'off',
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'prettier/prettier': 'error',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    args: 'all',
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/ban-types': [
                'error',
                {
                    types: {
                        object: false,
                    },
                    extendDefaults: true,
                },
            ],
            'import/extensions': [
                'off',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
            'import/no-cycle': 1,
            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',
            'import/order': [
                'error',
                {
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                    'newlines-between': 'always',
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before',
                        },
                        {
                            pattern: 'nav-**',
                            group: 'external',
                            position: 'after',
                        },
                        {
                            pattern: '@navikt/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                },
            ],
        },
    },
];
